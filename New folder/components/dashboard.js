import React from 'react'
import Styles from '../styles/proj.module.css'
import rowz from './row'
import { useState, useEffect } from 'react'
import api from './seats'
import JsPDF from 'jspdf'

export default function Dashboard() {
    var [ arr, setArr ] = useState( [] )
    var [ tab, setTab ] = useState( [] )
    var [ selectedxd, setSelectedxd ] = useState( [] );
    //api get seats
    const getSeats = async () => {
        const respon = await api.get( '/seats' );
        return respon.data;
    };
    const getReservations = async () => {
        const respon = await api.get( '/reservations' );
        return respon.data;
    };
    const getAllSeats = async () => {
        const allSeats = await getSeats();
        if ( allSeats ) setArr( allSeats );
    };
    const getAllReservations = async () => {
        const allResvs = await getReservations();
        if ( allResvs ) setTab( allResvs );
    };
    useEffect( () => {
        const getAllSeats = async () => {
            const allSeats = await getSeats();
            if ( allSeats ) setArr( allSeats );
        };
        const getAllReservations = async () => {
            const allResvs = await getReservations();
            if ( allResvs ) setTab( allResvs );
        };
        getAllSeats(); getAllReservations();
    }, [] );
    const RELOAD = () => {
        return new Promise( () => {
            setTimeout( () => {
                window.location.reload();
            }, 500 );
        } )
    };

    //api diagram buttons functions
    const yellower = async ( arr ) => {
        await api.put( `/seats/${ arr }`, {
            chairxds: arr,
            color: "yellow"
        } );
        await api.post( `/resvd/${ arr }`, {
            chairxds: arr
        } );
        getAllSeats(); RELOAD();
    };

    const greener = async ( arr ) => {
        await api.put( `/seats/${ arr }`, {
            chairxds: arr,
            color: "green"
        } );
        await api.put( `/resvd/${ arr }`, {
            chairxds: arr
        } );
        getAllSeats(); RELOAD();
    };

    const reder = async ( arr ) => {
        await api.put( `/seats/${ arr }`, {
            chairxds: arr,
            color: "red"
        } );
        await api.post( `/resvd/${ arr }`, {
            chairxds: arr
        } );
        getAllSeats(); RELOAD();
    };


    //api table functions confirm/delete seats
    const confirmSeatsTable = async ( arr ) => {
        await api.put( `/seats/${ arr }`, {
            chairxds: arr,
            color: "red"
        } );
        await api.post( `/resvd/${ arr }`, {
            chairxds: arr
        } );
        getAllSeats();
    };
    const deleteSeatsTable = async ( arr ) => {
        await api.put( `/seats/${ arr }`, {
            chairxds: arr,
            color: "green"
        } );
        await api.post( `/resvd/${ arr }`, {
            chairxds: arr
        } );
        await api.put( `/resvd/${ arr }`, {
            chairxds: arr
        } );
        getAllSeats();
    };
    const deleteUserTable = async ( x, y ) => {
        console.log( y );
        await api.delete( `/reservations/${ y }` );
        deleteSeatsTable( x );
        getAllReservations();
    };
    //frontend
    var [ selectedxd, setSelectedxd ] = useState( [] );
    function cellColor( color ) {
        switch ( color ) {
            case 'green':
                return 'green';
            case 'yellow':
                return 'yellow';
            case 'red':
                return 'red';
            default:
                return '';
        }
    };
    // copy values into table
    async function onCheck( e, xd, item ) {
        if ( e.target.checked ) {
            e.target.checked = true;
            setSelectedxd( [ ...selectedxd, xd ] );
        } else {
            e.target.checked = false;
            setSelectedxd( selectedxd.filter( ( currItem ) => currItem !== xd ) );
        }
    };

    const downloadInvoiceTable = () => {
        const report = new JsPDF( 'portrait', 'pt', 'a1' );
        report.html( document.querySelector( '.proj_Displaytable__DfEO8' ) ).then( () => {
            report.save( 'invoice.pdf' );
        } );
    }
    var zoom = 1;
    function zIn() {
        if ( zoom >= 1.5 ) { zoom = 1.5 };
        if ( 0.5 < zoom < 1.5 ) {
            zoom += 0.1;
            document.querySelector( '.proj_seatsBlock__2ZJQf' ).style.transform = `scale(  ${ zoom } )`;
        }
    };
    function rst() {
        zoom = 1;
        document.querySelector( '.proj_seatsBlock__2ZJQf' ).style.transform = `scale(  ${ zoom } )`;
    };
    function zOut() {
        if ( zoom <= 0.5 ) { zoom = 0.5 }
        if ( 0.5 < zoom < 1.5 ) {
            zoom -= 0.1;
            document.querySelector( '.proj_seatsBlock__2ZJQf' ).style.transform = `scale(  ${ zoom } )`;
        }
    };
    return (
        <div className={ Styles.bgr }>
            <center className={ Styles.toools }>
                <table style={ { width: "100%", textAlign: "center" } }><tbody>
                </tbody></table>
                <table style={ { textAlign: "center" } }><tbody><tr>
                    <td colSpan={ 5 }><div className={ Styles.mapped1 } style={ { pointerEvents: "none", backgroundColor: "green" } }><img src='/fill.png' alt="" /></div><br />Available</td>
                    <td style={ { visibility: "hidden" } }>....</td>
                    <td colSpan={ 5 }><div className={ Styles.mapped1 } style={ { pointerEvents: "none", backgroundColor: "yellow" } }><img src='/fill.png' alt="" /></div><br />On Hold</td>
                    <td style={ { visibility: "hidden" } }>....</td>
                    <td colSpan={ 5 }><div className={ Styles.mapped1 } style={ { pointerEvents: "none", backgroundColor: "red" } }><img src='/fill.png' alt="" /></div><br />Booked</td>
                </tr></tbody></table>
                <a  onClick={ () => zIn() }><i className="fas fa-search-plus"></i></a>
                <a  onClick={ () => zOut() }><i className="fas fa-search-minus"></i></a>
                <a  onClick={ () => rst() }><i className="fas fa-recycle"></i></a>
            </center>
            <div className={ Styles.seatStructure }>
                <table className={ `${ Styles.seatsBlock }  ${ Styles.target }` } >
                    <tbody>
                        <tr>
                            <td colSpan="101"><div className={ Styles.screen }>STAGE</div></td>
                        </tr>
                        <tr className={ Styles.seatVGap } ></tr>
                        <tr>
                            <td>A</td>
                            <td></td>
                            <td></td>
                            <td className={ Styles.seatGap } colSpan={ 1 }>...</td>
                            <td className={ Styles.seatGap } colSpan={ 1 }>...</td>
                            {
                                arr.slice( 0, 9 ).map( ( chair ) => {
                                    return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className={ Styles.seats } value={ chair.xd } id={ chair.xd } /><div className={ Styles.mapped } style={ {  backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><p>{ chair.xd }</p></label></div></td>
                                }
                                )
                            }
                            <td className={ Styles.seatGap } colSpan={ 1 }>...</td>
                            {
                                arr.slice( 9, 22 ).map( ( chair ) => {
                                    return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className={ Styles.seats } value={ chair.xd } id={ chair.xd } /><div className={ Styles.mapped } style={ {  backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><p>{ chair.xd }</p></label></div></td>
                                }
                                )
                            }
                            <td className={ Styles.seatGap } colSpan={ 1 }>...</td>
                            {
                                arr.slice( 22, 31 ).map( ( chair ) => {
                                    return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className={ Styles.seats } value={ chair.xd } id={ chair.xd } /><div className={ Styles.mapped } style={ {  backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><p>{ chair.xd }</p></label></div></td>
                                }
                                )
                            }
                            <td className={ Styles.seatGap } colSpan={ 1 }>...</td>
                            <td className={ Styles.seatGap } colSpan={ 1 }>...</td>
                        </tr>

                        <tr>
                            <td>B</td>
                            <td></td>
                            <td></td>
                            <td className={ Styles.seatGap } colSpan={ 1 }>...</td>
                            {
                                arr.slice( 31, 41 ).map( ( chair ) => {
                                    return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className={ Styles.seats } value={ chair.xd } id={ chair.xd } /><div className={ Styles.mapped } style={ {  backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><p>{ chair.xd }</p></label></div></td>
                                }
                                )
                            }
                            <td className={ Styles.seatGap } colSpan={ 1 }>...</td>
                            {
                                arr.slice( 41, 54 ).map( ( chair ) => {
                                    return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className={ Styles.seats } value={ chair.xd } id={ chair.xd } /><div className={ Styles.mapped } style={ {  backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><p>{ chair.xd }</p></label></div></td>
                                }
                                )
                            }
                            <td className={ Styles.seatGap } colSpan={ 1 }>...</td>
                            {
                                arr.slice( 54, 64 ).map( ( chair ) => {
                                    return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className={ Styles.seats } value={ chair.xd } id={ chair.xd } /><div className={ Styles.mapped } style={ {  backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><p>{ chair.xd }</p></label></div></td>
                                }
                                )
                            }
                            <td className={ Styles.seatGap } colSpan={ 1 }>...</td>
                        </tr>

                        <tr>
                            <td>C</td>
                            <td></td>
                            <td></td>
                            {
                                arr.slice( 64, 75 ).map( ( chair ) => {
                                    return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className={ Styles.seats } value={ chair.xd } id={ chair.xd } /><div className={ Styles.mapped } style={ {  backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><p>{ chair.xd }</p></label></div></td>
                                }
                                )
                            }
                            <td className={ Styles.seatGap } colSpan={ 1 }>...</td>
                            {
                                arr.slice( 75, 88 ).map( ( chair ) => {
                                    return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className={ Styles.seats } value={ chair.xd } id={ chair.xd } /><div className={ Styles.mapped } style={ {  backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><p>{ chair.xd }</p></label></div></td>
                                }
                                )
                            }
                            <td className={ Styles.seatGap } colSpan={ 1 }>...</td>
                            {
                                arr.slice( 88, 99 ).map( ( chair ) => {
                                    return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className={ Styles.seats } value={ chair.xd } id={ chair.xd } /><div className={ Styles.mapped } style={ {  backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><p>{ chair.xd }</p></label></div></td>
                                }
                                )
                            }
                        </tr>
                        <tr>
                            <td>D</td>
                            <td></td>
                            <td></td>
                            {
                                arr.slice( 99, 110 ).map( ( chair ) => {
                                    return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className={ Styles.seats } value={ chair.xd } id={ chair.xd } /><div className={ Styles.mapped } style={ {  backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><p>{ chair.xd }</p></label></div></td>
                                }
                                )
                            }
                            <td className={ Styles.seatGap } colSpan={ 1 }>...</td>
                            {
                                arr.slice( 110, 123 ).map( ( chair ) => {
                                    return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className={ Styles.seats } value={ chair.xd } id={ chair.xd } /><div className={ Styles.mapped } style={ {  backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><p>{ chair.xd }</p></label></div></td>
                                }
                                )
                            }
                            <td className={ Styles.seatGap } colSpan={ 1 }>...</td>
                            {
                                arr.slice( 123, 134 ).map( ( chair ) => {
                                    return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className={ Styles.seats } value={ chair.xd } id={ chair.xd } /><div className={ Styles.mapped } style={ {  backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><p>{ chair.xd }</p></label></div></td>
                                }
                                )
                            }
                        </tr>

                        <tr>
                            <td>E</td>
                            <td></td>
                            <td></td>
                            {
                                arr.slice( 134, 145 ).map( ( chair ) => {
                                    return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className={ Styles.seats } value={ chair.xd } id={ chair.xd } /><div className={ Styles.mapped } style={ {  backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><p>{ chair.xd }</p></label></div></td>
                                }
                                )
                            }
                            <td className={ Styles.seatGap } colSpan={ 1 }>...</td>
                            {
                                arr.slice( 145, 158 ).map( ( chair ) => {
                                    return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className={ Styles.seats } value={ chair.xd } id={ chair.xd } /><div className={ Styles.mapped } style={ {  backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><p>{ chair.xd }</p></label></div></td>
                                }
                                )
                            }
                            <td className={ Styles.seatGap } colSpan={ 1 }>...</td>
                            {
                                arr.slice( 158, 169 ).map( ( chair ) => {
                                    return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className={ Styles.seats } value={ chair.xd } id={ chair.xd } /><div className={ Styles.mapped } style={ {  backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><p>{ chair.xd }</p></label></div></td>
                                }
                                )
                            }
                        </tr>

                        <tr>
                            <td>F</td>
                            <td></td>
                            <td></td>
                            <td className={ Styles.seatGap } colSpan={ 1 }>...</td>
                            {
                                arr.slice( 169, 179 ).map( ( chair ) => {
                                    return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className={ Styles.seats } value={ chair.xd } id={ chair.xd } /><div className={ Styles.mapped } style={ {  backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><p>{ chair.xd }</p></label></div></td>
                                }
                                )
                            }
                            <td className={ Styles.seatGap } colSpan={ 1 }>...</td>
                            {
                                arr.slice( 179, 192 ).map( ( chair ) => {
                                    return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className={ Styles.seats } value={ chair.xd } id={ chair.xd } /><div className={ Styles.mapped } style={ {  backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><p>{ chair.xd }</p></label></div></td>
                                }
                                )
                            }
                            <td className={ Styles.seatGap } colSpan={ 1 }>...</td>
                            {
                                arr.slice( 192, 202 ).map( ( chair ) => {
                                    return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className={ Styles.seats } value={ chair.xd } id={ chair.xd } /><div className={ Styles.mapped } style={ {  backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><p>{ chair.xd }</p></label></div></td>
                                }
                                )
                            }
                            <td className={ Styles.seatGap } colSpan={ 1 }>...</td>
                        </tr>
                        <tr>
                            <td>G</td>
                            <td></td>
                            <td></td>
                            <td className={ Styles.seatGap } colSpan={ 1 }>...</td>
                            {
                                arr.slice( 202, 212 ).map( ( chair ) => {
                                    return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className={ Styles.seats } value={ chair.xd } id={ chair.xd } /><div className={ Styles.mapped } style={ {  backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><p>{ chair.xd }</p></label></div></td>
                                }
                                )
                            }
                            <td className={ Styles.seatGap } colSpan={ 1 }>...</td>
                            {
                                arr.slice( 212, 225 ).map( ( chair ) => {
                                    return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className={ Styles.seats } value={ chair.xd } id={ chair.xd } /><div className={ Styles.mapped } style={ {  backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><p>{ chair.xd }</p></label></div></td>
                                }
                                )
                            }
                            <td className={ Styles.seatGap } colSpan={ 1 }>...</td>
                            {
                                arr.slice( 225, 235 ).map( ( chair ) => {
                                    return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className={ Styles.seats } value={ chair.xd } id={ chair.xd } /><div className={ Styles.mapped } style={ {  backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><p>{ chair.xd }</p></label></div></td>
                                }
                                )
                            }
                            <td className={ Styles.seatGap } colSpan={ 1 }>...</td>
                        </tr>

                        <tr>
                            <td>H</td>
                            <td></td>
                            <td></td>
                            <td className={ Styles.seatGap } colSpan={ 1 }>...</td>
                            {
                                arr.slice( 235, 245 ).map( ( chair ) => {
                                    return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className={ Styles.seats } value={ chair.xd } id={ chair.xd } /><div className={ Styles.mapped } style={ {  backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><p>{ chair.xd }</p></label></div></td>
                                }
                                )
                            }
                            <td className={ Styles.seatGap } colSpan={ 1 }>...</td>
                            {
                                arr.slice( 245, 258 ).map( ( chair ) => {
                                    return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className={ Styles.seats } value={ chair.xd } id={ chair.xd } /><div className={ Styles.mapped } style={ {  backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><p>{ chair.xd }</p></label></div></td>
                                }
                                )
                            }
                            <td className={ Styles.seatGap } colSpan={ 1 }>...</td>
                            {
                                arr.slice( 258, 268 ).map( ( chair ) => {
                                    return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className={ Styles.seats } value={ chair.xd } id={ chair.xd } /><div className={ Styles.mapped } style={ {  backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><p>{ chair.xd }</p></label></div></td>
                                }
                                )
                            }
                            <td className={ Styles.seatGap } colSpan={ 1 }>...</td>
                        </tr>

                        <tr>
                            <td>I</td>
                            <td></td>
                            <td></td>
                            <td className={ Styles.seatGap } colSpan={ 1 }>...</td>
                            {
                                arr.slice( 268, 278 ).map( ( chair ) => {
                                    return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className={ Styles.seats } value={ chair.xd } id={ chair.xd } /><div className={ Styles.mapped } style={ {  backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><p>{ chair.xd }</p></label></div></td>
                                }
                                )
                            }
                            <td className={ Styles.seatGap } colSpan={ 1 }>...</td>
                            {
                                arr.slice( 278, 291 ).map( ( chair ) => {
                                    return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className={ Styles.seats } value={ chair.xd } id={ chair.xd } /><div className={ Styles.mapped } style={ {  backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><p>{ chair.xd }</p></label></div></td>
                                }
                                )
                            }
                            <td className={ Styles.seatGap } colSpan={ 1 }>...</td>
                            {
                                arr.slice( 291, 301 ).map( ( chair ) => {
                                    return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className={ Styles.seats } value={ chair.xd } id={ chair.xd } /><div className={ Styles.mapped } style={ {  backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><p>{ chair.xd }</p></label></div></td>
                                }
                                )
                            }
                            <td className={ Styles.seatGap } colSpan={ 1 }>...</td>
                        </tr>

                        <tr>
                            <td>J</td>
                            <td></td>
                            <td></td>
                            <td className={ Styles.seatGap } colSpan={ 1 }>...</td>
                            {
                                arr.slice( 301, 311 ).map( ( chair ) => {
                                    return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className={ Styles.seats } value={ chair.xd } id={ chair.xd } /><div className={ Styles.mapped } style={ {  backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><p>{ chair.xd }</p></label></div></td>
                                }
                                )
                            }
                            <td className={ Styles.seatGap } colSpan={ 1 }>...</td>
                            {
                                arr.slice( 311, 324 ).map( ( chair ) => {
                                    return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className={ Styles.seats } value={ chair.xd } id={ chair.xd } /><div className={ Styles.mapped } style={ {  backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><p>{ chair.xd }</p></label></div></td>
                                }
                                )
                            }
                            <td className={ Styles.seatGap } colSpan={ 1 }>...</td>
                            {
                                arr.slice( 324, 334 ).map( ( chair ) => {
                                    return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className={ Styles.seats } value={ chair.xd } id={ chair.xd } /><div className={ Styles.mapped } style={ {  backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><p>{ chair.xd }</p></label></div></td>
                                }
                                )
                            }
                            <td className={ Styles.seatGap } colSpan={ 1 }>...</td>
                        </tr>

                        <tr>
                            <td>K</td>
                            <td></td>
                            <td></td>
                            <td className={ Styles.seatGap } colSpan={ 1 }>...</td>
                            {
                                arr.slice( 334, 344 ).map( ( chair ) => {
                                    return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className={ Styles.seats } value={ chair.xd } id={ chair.xd } /><div className={ Styles.mapped } style={ {  backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><p>{ chair.xd }</p></label></div></td>
                                }
                                )
                            }
                            <td className={ Styles.seatGap } colSpan={ 1 }>...</td>
                            {
                                arr.slice( 344, 357 ).map( ( chair ) => {
                                    return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className={ Styles.seats } value={ chair.xd } id={ chair.xd } /><div className={ Styles.mapped } style={ {  backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><p>{ chair.xd }</p></label></div></td>
                                }
                                )
                            }
                            <td className={ Styles.seatGap } colSpan={ 1 }>...</td>
                            {
                                arr.slice( 357, 367 ).map( ( chair ) => {
                                    return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className={ Styles.seats } value={ chair.xd } id={ chair.xd } /><div className={ Styles.mapped } style={ {  backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><p>{ chair.xd }</p></label></div></td>
                                }
                                )
                            }
                            <td className={ Styles.seatGap } colSpan={ 1 }>...</td>
                        </tr>

                        <tr>
                            <td>L</td>
                            <td></td>
                            <td></td>
                            <td className={ Styles.seatGap } colSpan={ 1 }>...</td>
                            {
                                arr.slice( 367, 377 ).map( ( chair ) => {
                                    return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className={ Styles.seats } value={ chair.xd } id={ chair.xd } /><div className={ Styles.mapped } style={ {  backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><p>{ chair.xd }</p></label></div></td>
                                }
                                )
                            }
                            <td className={ Styles.seatGap } colSpan={ 1 }>...</td>
                            {
                                arr.slice( 377, 390 ).map( ( chair ) => {
                                    return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className={ Styles.seats } value={ chair.xd } id={ chair.xd } /><div className={ Styles.mapped } style={ {  backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><p>{ chair.xd }</p></label></div></td>
                                }
                                )
                            }
                            <td className={ Styles.seatGap } colSpan={ 1 }>...</td>
                            {
                                arr.slice( 390, 400 ).map( ( chair ) => {
                                    return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className={ Styles.seats } value={ chair.xd } id={ chair.xd } /><div className={ Styles.mapped } style={ {  backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><p>{ chair.xd }</p></label></div></td>
                                }
                                )
                            }
                            <td className={ Styles.seatGap } colSpan={ 1 }>...</td>
                        </tr>

                        <tr>
                            <td>M</td>
                            <td></td>
                            <td></td>
                            <td className={ Styles.seatGap } colSpan={ 1 }>...</td>
                            {
                                arr.slice( 400, 406 ).map( ( chair ) => {
                                    return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className={ Styles.seats } value={ chair.xd } id={ chair.xd } /><div className={ Styles.mapped } style={ {  backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><p>{ chair.xd }</p></label></div></td>
                                }
                                )
                            }
                            <td className={ Styles.seatGap } colSpan={ 11 }>...</td>
                            <td className={ Styles.seatGap } colSpan={ 11 }>...</td>
                            {
                                arr.slice( 406, 413 ).map( ( chair ) => {
                                    return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className={ Styles.seats } value={ chair.xd } id={ chair.xd } /><div className={ Styles.mapped } style={ {  backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><p>{ chair.xd }</p></label></div></td>
                                }
                                )
                            }
                            <td className={ Styles.seatGap } colSpan={ 1 }>...</td>
                        </tr>

                        <tr className={ Styles.seatVGap } ><td colSpan={ 39 } ><p style={ { float: "center", fontFamily: 'Times New Roman', color: 'black' } }>
                            ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------<br />
                            ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
                        </p></td></tr>

                        <tr>
                            <td>N</td>
                            <td></td>
                            <td></td>
                            <td className={ Styles.seatGap } colSpan={ 1 }>...</td>
                            {
                                arr.slice( 413, 423 ).map( ( chair ) => {
                                    return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className={ Styles.seats } value={ chair.xd } id={ chair.xd } /><div className={ Styles.mapped } style={ {  backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><p>{ chair.xd }</p></label></div></td>
                                }
                                )
                            }
                            <td className={ Styles.seatGap } colSpan={ 1 }>...</td>
                            {
                                arr.slice( 423, 436 ).map( ( chair ) => {
                                    return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className={ Styles.seats } value={ chair.xd } id={ chair.xd } /><div className={ Styles.mapped } style={ {  backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><p>{ chair.xd }</p></label></div></td>
                                }
                                )
                            }
                            <td className={ Styles.seatGap } colSpan={ 1 }>...</td>
                            {
                                arr.slice( 436, 446 ).map( ( chair ) => {
                                    return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className={ Styles.seats } value={ chair.xd } id={ chair.xd } /><div className={ Styles.mapped } style={ {  backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><p>{ chair.xd }</p></label></div></td>
                                }
                                )
                            }
                            <td className={ Styles.seatGap } colSpan={ 1 }>...</td>
                        </tr>

                        <tr>
                            <td>O</td>
                            <td></td>
                            <td></td>
                            <td className={ Styles.seatGap } colSpan={ 3 }>...</td>
                            {
                                arr.slice( 446, 454 ).map( ( chair ) => {
                                    return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className={ Styles.seats } value={ chair.xd } id={ chair.xd } /><div className={ Styles.mapped } style={ {  backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><p>{ chair.xd }</p></label></div></td>
                                }
                                )
                            }
                            <td className={ Styles.seatGap } colSpan={ 1 }>...</td>
                            {
                                arr.slice( 454, 467 ).map( ( chair ) => {
                                    return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className={ Styles.seats } value={ chair.xd } id={ chair.xd } /><div className={ Styles.mapped } style={ {  backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><p>{ chair.xd }</p></label></div></td>
                                }
                                )
                            }
                            <td className={ Styles.seatGap } colSpan={ 1 }>...</td>
                            {
                                arr.slice( 467, 475 ).map( ( chair ) => {
                                    return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className={ Styles.seats } value={ chair.xd } id={ chair.xd } /><div className={ Styles.mapped } style={ {  backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><p>{ chair.xd }</p></label></div></td>
                                }
                                )
                            }
                            <td className={ Styles.seatGap } colSpan={ 3 }>...</td>
                        </tr>

                        <tr>
                            <td>P</td>
                            <td></td>
                            <td></td>
                            <td className={ Styles.seatGap } colSpan={ 5 }>...</td>
                            {
                                arr.slice( 475, 481 ).map( ( chair ) => {
                                    return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className={ Styles.seats } value={ chair.xd } id={ chair.xd } /><div className={ Styles.mapped } style={ {  backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><p>{ chair.xd }</p></label></div></td>
                                }
                                )
                            }
                            <td className={ Styles.seatGap } colSpan={ 1 }>...</td>
                            {
                                arr.slice( 481, 494 ).map( ( chair ) => {
                                    return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className={ Styles.seats } value={ chair.xd } id={ chair.xd } /><div className={ Styles.mapped } style={ {  backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><p>{ chair.xd }</p></label></div></td>
                                }
                                )
                            }
                            <td className={ Styles.seatGap } colSpan={ 1 }>...</td>
                            {
                                arr.slice( 494, 500 ).map( ( chair ) => {
                                    return <td chair={ chair } key={ chair.xd }><input type="checkbox" onChange={ ( e ) => onCheck( e, chair.xd, chair ) } className={ Styles.seats } value={ chair.xd } id={ chair.xd } /><div className={ Styles.mapped } style={ {  backgroundColor: cellColor( chair.color ) } }><label htmlFor={ chair.xd } ><p>{ chair.xd }</p></label></div></td>
                                }
                                )
                            }
                            <td className={ Styles.seatGap } colSpan={ 5 }>...</td>
                        </tr>

                        <tr className={ Styles.seatVGap } ><td colSpan={ 39 } ><p style={ { float: "center", fontFamily: 'Times New Roman', color: 'black' } }></p></td></tr>

                    </tbody>
                </table>
            </div>

            <center>
                <button onClick={ () => yellower( selectedxd ) }>Hold (make  yellow)</button>
                <button onClick={ () => greener( selectedxd ) }>Cancel (make green)</button>
                <button onClick={ () => reder( selectedxd ) }>Confirm (make red)</button>
                <br/>
                <button onClick={ () => downloadInvoiceTable() }>Download PDF</button>
            </center>
            <div className={Styles.displayerBoxes}>
                <table className={ `${ Styles.Displaytable } ${ Styles.ivt }` }>
                    <tbody>
                        <tr>
                            <th>Number</th>
                            <th>Name</th>
                            <th>Phone Number</th>
                            <th>E-mail</th>
                            <th>Year</th>
                            <th>Student ID</th>
                            <th>Serial Numbers of Seats</th>
                            <th>Options</th>
                        </tr>
                        {
                            tab.map( ( user, index ) => {
                                return <tr user={ user } key={ user.phoneNum1 } >
                                    <td>{ index + 1 }</td>
                                    <td>{ user.userName }</td>
                                    <td>{ user.phoneNum1 }</td>
                                    <td>{ user.email }</td>
                                    <td>{ user.year }</td>
                                    <td>{ user.sid }</td>
                                    <td>{ user.chairxds.toString() }</td>
                                    <td><button onClick={ () => confirmSeatsTable( user.chairxds ) }><p>Confirm chairs</p></button>
                                        <button onClick={ () => deleteUserTable( user.chairxds, index ) }><p>delete user</p></button></td>
                                </tr>
                            }
                            )
                        }
                    </tbody>
                </table></div>
        </div> )
}
